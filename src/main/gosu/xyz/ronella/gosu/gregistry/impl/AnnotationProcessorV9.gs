package xyz.ronella.gosu.gregistry.impl

uses org.slf4j.Logger
uses org.slf4j.LoggerFactory
uses xyz.ronella.gosu.gregistry.AbstractAnnotationMetaBase
uses xyz.ronella.gosu.gregistry.IAnnotationMetaBase
uses xyz.ronella.gosu.gregistry.IAnnotationProcessor
uses xyz.ronella.gosu.gcache.ConcurrentLRUCache
uses xyz.ronella.gosu.gregistry.ExpectedTypeException

uses gw.lang.reflect.IType
uses java.util.concurrent.locks.ReentrantLock
uses java.util.Map
uses gw.lang.reflect.TypeSystem

/**
 * A processor designed for GWv9.
 *
 * @author Ron Webb
 * @since 2018-06-28
 */
class AnnotationProcessorV9 implements IAnnotationProcessor {

  private final static var LOG : Logger = LoggerFactory.getLogger("AnnotationProcessorV9")

  private construct() {}

  private static var ___INSTANCE = new AnnotationProcessorV9()

  public static property get Instance() : IAnnotationProcessor {
    return ___INSTANCE
  }

  private static final var LOCK_CLASS = new ReentrantLock()

  private static final var DEFAULT_CACHE_SIZE = 1000

  private static final var CACHE_INSTANCE_CODE2 = "InstanceStashV9"
  private static final var CACHE_INSTANCE2 = new ConcurrentLRUCache<String, Object>(CACHE_INSTANCE_CODE2, DEFAULT_CACHE_SIZE)

  private static final var CACHE_META_CODE2 = "MetadataStashV9"
  private static final var CACHE_META2 = new ConcurrentLRUCache<String,List<IAnnotationMetaBase>>(CACHE_META_CODE2, DEFAULT_CACHE_SIZE)


  override property get Metas() : ConcurrentLRUCache<String, List<IAnnotationMetaBase>> {
    return CACHE_META2
  }

  override function retrieveMeta(tag : Type) : List<IAnnotationMetaBase> {
    return CACHE_META2.get(tag?.Name)
  }

  override function storeMeta(tag : Type, _metas : List<IAnnotationMetaBase>) {
    using(LOCK_CLASS) {
      CACHE_META2.put(tag?.Name, _metas)
    }
  }

  override property get Instances() : ConcurrentLRUCache<String, Object> {
    return CACHE_INSTANCE2
  }

  override function retrieveInstance(key : String) : Object {
    return CACHE_INSTANCE2.get(key)
  }

  override function storeInstance(key : String, data : Object) {
    using (LOCK_CLASS) {
      CACHE_INSTANCE2.put(key, data)
    }
  }

  override function clear() {
    using(LOCK_CLASS) {
      CACHE_META2.clear()
      CACHE_INSTANCE2.clear()
    }
  }

  override function clearByType(type : Type) {
    using(LOCK_CLASS) {
      this.retrieveMeta(type)?.clear()
      this.storeMeta(type, null)
      this.Instances.clear()
    }
  }

  override function defaultAnnotationMetaBase<TYPE_ANNOTATION_BASE extends AbstractAnnotationMetaBase>() : Type<TYPE_ANNOTATION_BASE> {
    return SimpleAnnotationMeta2.Type as Type<TYPE_ANNOTATION_BASE>
  }

  override function validate<TYPE_ANNOTATION>(ctx : Map<String, Object>, type : IType, tag : Type<TYPE_ANNOTATION>) {
    var annotationInstance = annotationInfoInstance<TYPE_ANNOTATION>(type, tag)
    var annotationName = TYPE_ANNOTATION.Name
    var evalText = "(annotationInstance as ${annotationName}).implementInterface()"
    try {
      var implementInterface = eval(evalText) as String
      var interfaceType = TypeSystem.getByFullName(implementInterface)
      var typeHasInterfaceType = type.Interfaces.hasMatch(\ ___interface -> ___interface.Name == interfaceType.Name)
      if (!typeHasInterfaceType) {
        var message = "${annotationName} requires ${interfaceType.Name}"
        throw new ExpectedTypeException(message)
      }
    }
    catch(exp : gw.lang.parser.exceptions.ParseResultsException) {
      LOG.trace("implemetInterface() method not found.")
    }
  }

  override function annotationInfoInstance<TYPE_ANNOTATION>(type : IType, tag : Type<TYPE_ANNOTATION>) : Object {
    return type.TypeInfo.getAnnotation(tag).Instance
  }

  override property get Version() : String {
    return "GW9+"
  }

}