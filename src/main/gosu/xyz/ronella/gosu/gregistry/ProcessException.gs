package xyz.ronella.gosu.gregistry

/**
 * Thrown if the process is interrupted by an exception.
 * @author Ron Webb
 * @since 2016-07-08
 */
class ProcessException extends AnnotationScannerException {
  
  /**
   * Creates an instance of ProcessException.
   */
  construct() {
    super()
  }

  /**
   * Creates an instance of ProcessException.
   * @param msg The error message.
   */  
  construct(msg : String) {
    super(msg)
  }
}