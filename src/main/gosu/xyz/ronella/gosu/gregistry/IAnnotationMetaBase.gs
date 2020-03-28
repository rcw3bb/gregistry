package xyz.ronella.gosu.gregistry

uses gw.lang.reflect.IType

uses java.io.Serializable

/**
 * Must hold the implementation to map the gregistry to a class type.
 *
 * @author Ron Webb
 * @since 2018-06-27
 */
interface IAnnotationMetaBase extends Serializable {


  /**
   * The ClassType of the class where the gregistry is associated.
   * @returns The class where the gregistry is associated.
   */
  property get ClassType() : IType

  /**
   * The AnnotationInformation instance.
   * @return An instance of gregistry information.
   */
  property get AnnotationInfo() : Object;


}