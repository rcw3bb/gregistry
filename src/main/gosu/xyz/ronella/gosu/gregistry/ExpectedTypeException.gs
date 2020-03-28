package xyz.ronella.gosu.gregistry

/**
 * The exception thrown if the expected type associated with the gregistry is not met.
 * @author Ron Webb
 * @since 2016-06-30
 */
class ExpectedTypeException extends AnnotationScannerException {
  
  /**
   * Creates an instance of ExpectedTypeException.
   */
  construct() {
    super()
  }

  /**
   * Creates an instance of ExpectedTypeException.
   * @param msg The error message.
   */  
  construct(msg : String) {
    super(msg)
  }
}
