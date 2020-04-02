package xyz.ronella.gosu.gregistry
uses gw.test.TestClass
uses java.lang.Throwable

uses xyz.ronella.gosu.gregistry.impl.AnnotationProcessorV9
uses xyz.ronella.gosu.gregistry.impl.SimpleAnnotationMeta2

class GScannerTest extends TestClass {
  
  override function beforeTestMethod() {
    super.beforeTestMethod()
    GScanner.clearCache()
  }

  override function afterTestMethod(thrown : Throwable) {
    super.afterTestMethod(thrown)
  }
  
  function testAnnotation1ExtractCount() {
    var metas = GScanner.Instance.extract(Annotation1)
    assertEquals(1, metas.Count)
  }
  
  function testAnnotation1ExtractMeta() {
    var metas = GScanner.Instance.extract(Annotation1)
    assertTrue(metas.first() typeis SimpleAnnotationMeta2)
  }

  function testAnnotation1ExtractMetaAnnotation() {
    var meta = GScanner.Instance.extract(Annotation1.Type).first()
    assertTrue(meta.AnnotationInfo typeis Annotation1)
  }
  
  function testAnnotation1ExtractMetaClassType() {
    var meta = GScanner.Instance.extract(Annotation1).first()
    assertEquals(AnnotatedClass1.Type, meta.ClassType)
  }

  function testClearByTypeMetaTypeAnnotation1() {
    GScanner.Instance.extract(Annotation1.Type)
    GScanner.Instance.extract(Annotation2.Type)
    GScanner.clearCacheByType(Annotation1.Type)
    assertNull(AnnotationProcessorV9.Instance.retrieveMeta(Annotation1.Type))
    assertNotNull(AnnotationProcessorV9.Instance.retrieveMeta(Annotation2.Type))
  }

  function testClearByTypeMetaTypeAnnotation1Value() {
    GScanner.Instance.extract(Annotation1.Type)
    GScanner.Instance.extract(Annotation2.Type)
    GScanner.clearCacheByType(Annotation2.Type)
    assertTrue(AnnotationProcessorV9.Instance.retrieveMeta(Annotation1.Type)?.first() typeis SimpleAnnotationMeta2)
  }  

  function testClearByTypeMetaTypeAnnotation2() {
    GScanner.Instance.extract(Annotation1.Type)
    GScanner.Instance.extract(Annotation2.Type)
    GScanner.clearCacheByType(Annotation2.Type)
    assertNull(AnnotationProcessorV9.Instance.retrieveMeta(Annotation2.Type))
    assertNotNull(AnnotationProcessorV9.Instance.retrieveMeta(Annotation1.Type))
  }

  function testClearByTypeMetaTypeAnnotation2Value() {
    GScanner.Instance.extract(Annotation1.Type)
    GScanner.Instance.extract(Annotation2.Type)
    GScanner.clearCacheByType(Annotation2.Type)
    assertTrue(AnnotationProcessorV9.Instance.retrieveMeta(Annotation2.Type)?.first()==null)
  }
  
  function testNoClassAnnotated() {
    assertEquals(AnnotationProcessorV9.Instance.retrieveMeta(Annotation4.Type)?.Count, 0)
  }

  function testAnnotationInterfaceExtract() {
    GScanner.Instance.extract(Annotation3.Type)
    assertTrue(AnnotationProcessorV9.Instance.retrieveMeta(Annotation3.Type)?.first() typeis SimpleAnnotationMeta2)
  }

  function testAnnotationInterfaceExecute() {
    assertCausesException(\ -> {
      GScanner.Instance.process<Annotation3, AnnotatedClass2>(
        Annotation3.Type //Annotation Type
        ,SimpleAnnotationMeta2.Type //Annotation Meta Type
        , {} //Context
        , \ ___ctx, ___annotation, ___instance -> { //Execute logic
          return false    
        }
        , true //Should cache
      )
    }, ExpectedTypeException)
  }

  function testAnnotationExecuteContext() {
    GScanner.Instance.process<Annotation1, AnnotatedClass1>(
        Annotation1.Type //Annotation Type
        ,SimpleAnnotationMeta2.Type //Annotation Meta Type
        , {"CTX" -> "THE_CTX"} //Context
        , \ ___ctx, ___annotation, ___instance -> { //Execute logic
      assertEquals(___ctx["CTX"], "THE_CTX")
      return false
    }
        , true //Should cache
    )
  }

  function testAnnotationExecuteAnnotationType() {
    GScanner.Instance.process<Annotation1, AnnotatedClass1>(
      Annotation1.Type //Annotation Type
      ,SimpleAnnotationMeta2.Type //Annotation Meta Type
      , {} //Context
      , \ ___ctx, ___annotation, ___instance -> { //Execute logic
        assertTrue(___annotation typeis Annotation1)
        return false 
      }
      , true //Should cache
    )
  }

  function testAnnotationExecuteInstanceType() {
    GScanner.Instance.process<Annotation1, AnnotatedClass1>(
      Annotation1.Type //Annotation Type
      ,SimpleAnnotationMeta2.Type //Annotation Meta Type
      , {} //Context
      , \ ___ctx, ___annotation, ___instance -> { //Execute logic
        assertTrue(___instance typeis AnnotatedClass1)
        return false 
      }
      , true //Should cache
    )
  }

  function testAnnotation1PropValue() {
    GScanner.Instance.process<Annotation1, AnnotatedClass1>(
        Annotation1.Type //Annotation Type
        ,SimpleAnnotationMeta2.Type //Annotation Meta Type
        , {} //Context
        , \ ___ctx, ___annotation, ___instance -> { //Execute logic
      if (___annotation typeis Annotation1) {
        var prop1 = ___annotation.prop1()
        assertEquals("2", prop1)
      }
      else {
        throw new AssertionError("Invalid annotation type.")
      }
      return false
    }
        , true //Should cache
    )
  }
  
  function testAnnotationExecuteRecursive() {
    var count = 0
    GScanner.Instance.process<Annotation5, Object>(
      Annotation5.Type //Annotation Type
      ,SimpleAnnotationMeta2.Type //Annotation Meta Type
      , {} //Context
      , \ ___ctx, ___annotation, ___instance -> { //Execute logic
        count++
        return true
      }
      , true //Should cache
    )
    assertEquals(count, 2)
  }
  
  function testAnnotationExecuteNotRecursive() {
    var count = 0
    GScanner.Instance.process<Annotation5, Object>(
      Annotation5.Type //Annotation Type
      ,SimpleAnnotationMeta2.Type //Annotation Meta Type
      , {} //Context
      , \ ___ctx, ___annotation, ___instance -> { //Execute logic
        count++
        return false
      }
      , true //Should cache
    )
    assertEquals(count, 1)
  }
  
  function testAnnotationExecuteInterface() {
    GScanner.Instance.process<Annotation6, IAnnotation6>(
      Annotation6.Type //Annotation Type
      ,SimpleAnnotationMeta2.Type //Annotation Meta Type
      , {} //Context
      , \ ___ctx, ___annotation, ___instance -> { //Execute logic
        assertTrue(___instance typeis IAnnotation6)
        return true
      }
      , true //Should cache
    )
  }

  function testExecParameterOnly() {
    var isProcessed : boolean
    GScanner.Instance.process<Annotation6, IAnnotation6>(\ ___ctx, ___annotation, ___instance -> { //Execute logic
      isProcessed = true
      return true
    })
    assertTrue(isProcessed)
  }

  function testNonSerializedAnnotatedClass() {
    assertCausesException(\ -> {
      GScanner.Instance.process<Annotation8, AnnotatedClass8>(
        Annotation8.Type //Annotation Type
        ,SimpleAnnotationMeta2.Type //Annotation Meta Type
        , {} //Context
        , \ ___ctx, ___annotation, ___instance -> { //Execute logic
          return true
        }
        , true //Should cache
      )  
    }, ObjectMustBeSerializableException)
  }

}
