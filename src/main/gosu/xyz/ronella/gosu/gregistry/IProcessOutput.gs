package xyz.ronella.gosu.gregistry

/**
 * Must be implemented for process method output.
 * @author Ron Webb
 * @since 2016-06-30
 */
interface IProcessOutput {

  /**
   * Gives the context of upon processing.
   * @return An instance of Map.
   */
  property get Context() : Map<String, Object>
    
  /**
   * Gives the status of the proces method.
   * @return An instance of ProcessStatus.
   */
  property get Status() : ProcessStatus

  /**
   * Gives the sub status of the proces method.
   * @return An instance of ProcessStatus.
   */
  property get SubStatus() : ProcessStatus

  /**
   * Gives the error message of the proces method if the Status is error.
   * @return The error message.
   */
  property get ErrorMessage() : String
}
