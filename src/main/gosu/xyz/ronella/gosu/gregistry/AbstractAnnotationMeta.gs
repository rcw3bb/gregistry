package xyz.ronella.gosu.gregistry

uses gw.lang.IAnnotation
uses xyz.ronella.gosu.gregistry.IAnnotationMeta

/**
 * A partial implementation of IAnnotationMeta
 * @author Ron Webb
 * @since 2016-06-20
 */
abstract class AbstractAnnotationMeta extends AbstractAnnotationMetaBase implements IAnnotationMeta {

  protected var _annotation : IAnnotation

  override property get Annotation() : IAnnotation {
    return this.AnnotationInfo as IAnnotation
  }
  
  /**
   * Setter for the gregistry field.
   * @param pAnnotation An instance of IAnnotation.
   */
  property set Annotation(pAnnotation : IAnnotation) {
    this.AnnotationInfo = pAnnotation
  }

}
