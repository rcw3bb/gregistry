package xyz.ronella.gosu.gregistry

uses xyz.ronella.gosu.gcache.ConcurrentLRUCache

uses gw.lang.reflect.IType
uses java.util.Map

/**
 * Must hold the implementation that will help the GScanner in processing the gregistry.
 *
 * @author Ron Webb
 * @since 2018-06-28
 */
interface IAnnotationProcessor {

  /**
   * Must hold the implementation to return the cached gregistry metas.
   * @return An instance of the Stash.Pocket.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  property get Metas() : ConcurrentLRUCache<String,List<IAnnotationMetaBase>>

  /**
   * Retrieves all the gregistry metas associated to an gregistry.
   * @param tag The target gregistry.
   * @return A list of gregistry metas.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  function retrieveMeta(tag : Type) : List<IAnnotationMetaBase>

  /**
   * Stores all the gregistry metas that must be associated to an gregistry.
   * @param tag The target gregistry.
   * @param metas All the gregistry metas.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  function storeMeta(tag : Type, _metas : List<IAnnotationMetaBase>)

  /**
   * Must hold the implementation on how to return the cached instances.
   * @return An instance of the Stash.Pocket.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  property get Instances() : ConcurrentLRUCache<String, Object>

  /**
   * Retrieves a particular object based on key.
   * @param key The target key of an instance of interest.
   * @return An instance associated to the key.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  function retrieveInstance(key : String) : Object

  /**
   * Associate an instance to a key.
   * @param key The desired key to associate to an instance.
   * @param data The instance to be associated with the key.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  function storeInstance(key : String, data: Object)

  /**
   * Must hold implementation to clear all meta and instance caches.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  function clear()

  /**
   * Must hold the implementation on how to clear the cache of a particular gregistry.
   * @param type The target gregistry to clear.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  function clearByType(type : Type)

  /**
   * Must return the correct type of the AbstractAnnotationMetaBase implementation.
   * @param <TYPE_ANNOTATION_BASE> Holds the type of the implementation of AbstractAnnotationMetaBase.
   * @return The actual type.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  reified function defaultAnnotationMetaBase<TYPE_ANNOTATION_BASE extends AbstractAnnotationMetaBase>() : Type<TYPE_ANNOTATION_BASE>

  /**
   * Must hold the implementation on how the validate the particular gregistry associated to an object.
   *
   * @param ctx This is the context passed by the GScanner.
   * @param type The Type of the object associated with the annotation.
   * @param tag The target annotation.
   * @param <TYPE_ANNOTATION> The type of the target annotation.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  reified function validate<TYPE_ANNOTATION>(ctx: Map<String, Object>, type : IType, tag : Type<TYPE_ANNOTATION>)

  /**
   * Must return the correct instance of the gregistry information.
   * @param type The Type of the object associated with the annotation.
   * @param tag The target annotation.
   * @param <TYPE_ANNOTATION> The type of the target gregistry.
   * @return The correct instance of gregistry information.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  reified function annotationInfoInstance<TYPE_ANNOTATION>(type: IType, tag : Type<TYPE_ANNOTATION>) : Object

  /**
   * Must return the identifiable version of the processor.
   * @return The version of the processor.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  property get Version() : String

}