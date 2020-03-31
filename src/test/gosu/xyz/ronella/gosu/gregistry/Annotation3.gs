package xyz.ronella.gosu.gregistry

uses java.lang.annotation.ElementType
uses java.lang.annotation.Retention
uses java.lang.annotation.Target

@Target({ElementType.TYPE})
@Retention(RUNTIME)
annotation Annotation3 {

  function implementInterface() : String = "xyz.ronella.gosu.gregistry.IAnnotation3"

}
