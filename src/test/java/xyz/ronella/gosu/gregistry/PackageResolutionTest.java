package xyz.ronella.gosu.gregistry;

/**
 * Only use this class for package resolution that is coming from gosu dependencies.
 */
import gw.test.TestClass;

import java.io.Serializable;

public class PackageResolutionTest extends TestClass {

    public void testSimple() {
        System.out.printf("Only use this class for identifying the package from gosu dependencies.");
    }

}
