package xyz.ronella.gosu.gregistry

uses gw.test.TestClass

class GRegistryConfigTest extends TestClass {

  public function testDefaultEnlistCacheSize() {
    assertEquals(10000, GRegistryConfig.EnlistCacheSize)
  }

  public function testDefaultInstanceCacheSize() {
    assertEquals(1000, GRegistryConfig.InstanceCacheSize)
  }

  public function testDefaultTagMataCacheSize() {
    assertEquals(1000, GRegistryConfig.TagMetaCacheSize)
  }


}