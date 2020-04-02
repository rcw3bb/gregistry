package xyz.ronella.gosu.gregistry

/**
 * Exposes the configurable parameters of GRegistry.
 *
 * @author Ron Webb
 * @since 2020-04-03
 */
class GRegistryConfig {

  private final static var DEFAULT_ENLIST_CACHE_SIZE : String = "10000"
  private final static var DEFAULT_INSTANCE_CACHE_SIZE : String = "1000"
  private final static var DEFAULT_TAG_META_CACHE_SIZE : String = "1000"

  /**
   * Controls the size of cache of the enlisted classes in registry.
   *
   * The value is based on the vm parameter GRegEnlistCacheSize otherwise the default is 10000
   *
   * @return The size of the cache.
   *
   * @author Ron Webb
   * @since 2020-04-03
   */
  public static property get EnlistCacheSize() : int {
    return Integer.valueOf(System.getProperty("GRegEnlistCacheSize")?:DEFAULT_ENLIST_CACHE_SIZE)
  }

  /**
   * Controls the size of cache of the instance classes based on target annotation.
   *
   * The value is based on the vm parameter GRegInstanceCacheSize otherwise the default is 1000
   *
   * @return The size of the cache.
   *
   * @author Ron Webb
   * @since 2020-04-03
   */
  public static property get InstanceCacheSize() : int {
    return Integer.valueOf(System.getProperty("GRegInstanceCacheSize")?:DEFAULT_INSTANCE_CACHE_SIZE)
  }

  /**
   * Controls the size of cache of the mapping of the annotation and instance classes.
   *
   * The value is based on the vm parameter GRegTagMetaCacheSize otherwise the default is 1000
   *
   * @return The size of the cache.
   *
   * @author Ron Webb
   * @since 2020-04-03
   */
  public static property get TagMetaCacheSize() : int {
    return Integer.valueOf(System.getProperty("GRegTagMetaCacheSize")?:DEFAULT_TAG_META_CACHE_SIZE)
  }

}