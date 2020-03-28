package xyz.ronella.gosu.gregistry

uses gw.lang.reflect.IAnnotationInfo
uses gw.lang.reflect.IType
uses java.io.Serializable


/**
 * Must be implemented to hold the gregistry information.
 * @author Ron Webb
 * @since 2018-06-25
 */
interface IAnnotationMeta2 extends IAnnotationMetaBase {

  /**
   * The gregistry attached to the class type.
   * @returns The IAnnotation implementation.
   */
  property get Annotation() : IAnnotationInfo

}