package xyz.ronella.gosu.gregistry

uses gw.lang.reflect.IType

/**
 * A partial implementation of IAnnotationMetaBase
 *
 * @author Ron Webb
 * @since 2018-06-28
 */
abstract class AbstractAnnotationMetaBase implements IAnnotationMetaBase {

  protected var _classType : IType
  protected var _annotationInfo : Object

  override property get ClassType() : IType {
    return _classType
  }

  /**
   * Setter for the class type field.
   * @param pClassType An instance of IType.
   */
  property set ClassType(pClassType : IType) {
    this._classType = pClassType
  }

  override property get AnnotationInfo() : Object {
    return _annotationInfo
  }

  property set AnnotationInfo(obj: Object) {
    this._annotationInfo = obj
  }

}