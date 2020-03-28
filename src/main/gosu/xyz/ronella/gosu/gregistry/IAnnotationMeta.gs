package xyz.ronella.gosu.gregistry
uses gw.lang.reflect.IType
uses gw.lang.reflect.IAnnotationInfo
uses java.io.Serializable

/**
 * Must be implemented to hold the gregistry information.
 * @author Ron Webb
 * @since 2016-06-20
 */
interface IAnnotationMeta extends IAnnotationMetaBase {
  
  /**
   * The gregistry attached to the class type.
   * @returns The IAnnotation implementation.
   */
  property get Annotation() : IAnnotation
  
}
