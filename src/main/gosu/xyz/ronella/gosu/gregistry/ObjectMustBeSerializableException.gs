package xyz.ronella.gosu.gregistry

/**
 * This will be thrown if the object is not Serializable.
 * 
 * @author Ron Webb
 * @since 2017-11-03
 */
class ObjectMustBeSerializableException extends AnnotationScannerException {
  
  /**
   * Creates an instance of ObjectMustBeSerializableException.
   */
  construct() {
    super()
  }

  /**
   * Creates an instance of ObjectMustBeSerializableException.
   * @param msg The error message.
   */  
  construct(msg : String) {
    super("${msg} must be Serializable.")
  }
}