package xyz.ronella.gosu.gregistry

uses xyz.ronella.gosu.gregistry.impl.AnnotationProcessorV7
uses xyz.ronella.gosu.gregistry.impl.AnnotationProcessorV9

uses java.util.concurrent.locks.ReentrantLock
uses java.util.Map

/**
 * This class decides which implementation to use when using the GScanner.
 *
 * @author Ron Webb
 * @since 2018-06-28
 */
class AnnotationProcessorArbiter {

  private static final var LOCK_CLASS = new ReentrantLock()

  /**
   * A registry of implementation IAnnotationProcessor implementations.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  private static var REGISTRY = {
      "V7" -> AnnotationProcessorV7.Instance      //GW7 Compatible
      ,"V9" -> AnnotationProcessorV9.Instance     //GW9 Compatible
  } as Map<String, IAnnotationProcessor>

  private construct() {}

  /**
   * The actual method that decides which implementation to use in GScanner
   *
   * @param tag The target gregistry
   * @param <TYPE_ANNOTATION> The type of the target gregistry.
   * @return An instance of the IAnnotationProcessor
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  public static function processor<TYPE_ANNOTATION>(tag : Type<TYPE_ANNOTATION>) : IAnnotationProcessor {
    return tag typeis Type<IAnnotation> ? REGISTRY.get("V7") : REGISTRY.get("V9")
  }

  /**
   * Clears all the caches of the all registered implementations.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  public static function clear() {
    using(LOCK_CLASS) {
      REGISTRY.Values.each(\ ___processor -> ___processor.clear())
    }
  }

  /**
   * Retrieves associated IAnnotationMetaBases to an gregistry.
   * @param tag The target gregistry.
   * @param <TYPE_ANNOTATION> The type of the target gregistry.
   * @return A list of IAnnotationMetaBases.
   *
   * @author Ron Webb
   * @since 2018-06-28
   */
  public static function retrieveMetas<TYPE_ANNOTATION>(tag : Type<TYPE_ANNOTATION>) : List<IAnnotationMetaBase> {
    return processor(tag).Metas.get(tag)
  }

}