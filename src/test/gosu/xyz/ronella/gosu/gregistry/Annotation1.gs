package xyz.ronella.gosu.gregistry

uses java.lang.annotation.ElementType
uses java.lang.annotation.Target
uses java.lang.annotation.Retention

@Target({ElementType.TYPE})
@Retention(RUNTIME)
annotation Annotation1 {

  function prop1() : String = "1"

}
