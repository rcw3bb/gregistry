package xyz.ronella.gosu.gregistry

/**
 * Extraction cannot be completed on time.
 * @author Ron Webb
 * @since 2017-03-24
 */
class ExtractionTimeoutException extends AnnotationScannerException {
  
  /**
   * Creates an instance of ExtractionTimeoutException.
   */
  construct() {
    super()
  }

  /**
   * Creates an instance of ExtractionTimeoutException.
   * @param msg The error message.
   */  
  construct(msg : String) {
    super(msg)
  }
}
