package xyz.ronella.gosu.gregistry

/**
 * Defined status of GScanner.process() methods.
 * @author Ron Webb
 * @since 2016-06-30
 */
enum ProcessStatus {
  /**
   * The processing is cut short. This is normally found as sub status.
   */
  CUT_SHORT 
  
  /**
   * The processing is terminated normally.
   */              
  , NORMAL_TERMINATION
  
  /**
   * The processing is still on going.
   */
  , PROCESSING
  
  /**
   * The processing is not started yet.
   */
  , IDLE
  
  /**
   * An error as thrown during processing that cause the processing to be stopped.
   */
  , ERROR
}
