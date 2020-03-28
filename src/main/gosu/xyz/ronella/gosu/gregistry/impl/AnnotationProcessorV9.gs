package xyz.ronella.gosu.gregistry.impl

uses xyz.ronella.gosu.gregistry.AbstractAnnotationMetaBase
uses xyz.ronella.gosu.gregistry.IAnnotationMetaBase
uses xyz.ronella.gosu.gregistry.IAnnotationProcessor
uses xyz.ronella.gosu.gcache.ConcurrentLRUCache

uses gw.lang.reflect.IType
uses java.util.concurrent.locks.ReentrantLock
uses java.util.Map

/**
 * A processor designed for GWv9.
 *
 * @author Ron Webb
 * @since 2018-06-28
 */
class AnnotationProcessorV9 implements IAnnotationProcessor {

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

  override function validate<TYPE_ANNOTATION>(ctx : Map<String, Object>, tag : TYPE_ANNOTATION, objInstance : Object) {
  }

  override function annotationInfoInstance<TYPE_ANNOTATION>(type : IType, tag : Type<TYPE_ANNOTATION>) : Object {
    return type.TypeInfo.getAnnotation(tag).Instance
  }

  override property get Version() : String {
    return "GW9+"
  }

}