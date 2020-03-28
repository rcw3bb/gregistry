package xyz.ronella.gosu.gregistry

uses gw.lang.reflect.IAnnotationInfo

/**
 * A partial implementation of IAnnotationMeta2
 * @author Ron Webb
 * @since 2018-06-25
 */
abstract class AbstractAnnotationMeta2 extends AbstractAnnotationMetaBase implements IAnnotationMeta2 {

  override property get Annotation() : IAnnotationInfo {
    return this.AnnotationInfo as IAnnotationInfo
  }

  /**
   * Setter for the gregistry field.
   * @param pAnnotation An instance of IAnnotation.
   */
  property set Annotation(pAnnotation : IAnnotationInfo) {
    this.AnnotationInfo = pAnnotation
  }

}
