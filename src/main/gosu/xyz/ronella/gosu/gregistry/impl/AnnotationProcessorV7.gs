package xyz.ronella.gosu.gregistry.impl

uses gw.lang.reflect.IType
uses xyz.ronella.gosu.gregistry.AbstractAnnotationMetaBase
uses xyz.ronella.gosu.gregistry.GRegistryConfig
uses xyz.ronella.gosu.gregistry.IAnnotationMetaBase
uses xyz.ronella.gosu.gregistry.IAnnotationProcessor
uses java.util.concurrent.locks.ReentrantLock
uses java.util.Map
uses xyz.ronella.gosu.gcache.ConcurrentLRUCache

/**
 * A processor designed for GWv7.
 *
 * @author Ron Webb
 * @since 2018-06-28
 */
class AnnotationProcessorV7 implements IAnnotationProcessor {

  private construct() {}

  private static var ___INSTANCE = new AnnotationProcessorV7()

  public static property get Instance() : IAnnotationProcessor {
    return ___INSTANCE
  }

  private static final var LOCK_CLASS = new ReentrantLock()

  private static final var DEFAULT_INSTANCE_CACHE_SIZE = GRegistryConfig.InstanceCacheSize
  private static final var DEFAULT_TAG_META_CACHE_SIZE = GRegistryConfig.TagMetaCacheSize

  private static final var CACHE_INSTANCE_CODE = "InstanceStashV7"
  private static final var CACHE_INSTANCE  = new ConcurrentLRUCache<String, Object>(CACHE_INSTANCE_CODE, DEFAULT_INSTANCE_CACHE_SIZE)

  private static final var CACHE_META_CODE = "MetadataStashV7"
  private static final var CACHE_META = new ConcurrentLRUCache<String,List<IAnnotationMetaBase>>(CACHE_META_CODE, DEFAULT_TAG_META_CACHE_SIZE)

  override property get Metas() : ConcurrentLRUCache<String,List<IAnnotationMetaBase>> {
    return CACHE_META
  }

  override function retrieveMeta(tag : Type) : List<IAnnotationMetaBase> {
    return CACHE_META.get(tag?.Name)
  }

  override function storeMeta(tag : Type, _metas : List<IAnnotationMetaBase>) {
    using(LOCK_CLASS) {
      CACHE_META.put(tag?.Name, _metas)
    }
  }

  override property get Instances() : ConcurrentLRUCache<String, Object> {
    return CACHE_INSTANCE
  }

  override function retrieveInstance(key : String) : Object {
    return CACHE_INSTANCE.get(key)
  }

  override function storeInstance(key : String, data : Object) {
    using(LOCK_CLASS) {
      CACHE_INSTANCE.put(key, data)
    }
  }

  override function clear() {
    using(LOCK_CLASS) {
      CACHE_META.clear()
      CACHE_INSTANCE.clear()
    }
  }

  override function clearByType(type : Type) {
    using(LOCK_CLASS) {
      this.retrieveMeta(type)?.clear()
      this.storeMeta(type, null)
      this.Instances.clear()
    }
  }

  override reified function defaultAnnotationMetaBase<TYPE_ANNOTATION_BASE extends AbstractAnnotationMetaBase>() : Type<TYPE_ANNOTATION_BASE> {
    return SimpleAnnotationMeta.Type as Type<TYPE_ANNOTATION_BASE>
  }

  override reified function validate<TYPE_ANNOTATION>(ctx : Map<String, Object>, type : IType, tag : Type<TYPE_ANNOTATION>) {
  }

  override reified function annotationInfoInstance<TYPE_ANNOTATION>(type : IType, tag : Type<TYPE_ANNOTATION>) : Object {
    return type.TypeInfo.getAnnotation(tag).Instance
  }

  override property get Version() : String {
    return "GW7"
  }
  
}