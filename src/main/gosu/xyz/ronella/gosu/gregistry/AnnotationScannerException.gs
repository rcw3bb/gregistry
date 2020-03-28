package xyz.ronella.gosu.gregistry

uses java.lang.Exception

/**
 * All exception from GScanner is a subclass of this exception.
 * @author Ron Webb
 * @since 2016-06-30
 */
class AnnotationScannerException extends Exception {

  /**
   * Creates an instance of AnnotationScannerException.
   */
  construct() {
    super()
  }

  /**
   * Creates an instance of AnnotationScannerException.
   * @param msg The error message.
   */  
  construct(msg: String) {
    super(msg)
  }

}
