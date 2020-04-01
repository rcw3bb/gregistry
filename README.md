# GRegistry

A simple gosu implementation of code registry where you can retrieve a group of classes marked by custom annotation.

## IEnlist Interface

**IEnlist** is a **marker interface** where all the classes implementing it will become part of the registry. Moreover, all the classes marked by this interface must also be marked as **Serializable**. Also, it is recommended that these classes must not have any state associated with it.

## Custom Annotation

A custom annotation can be defined with the following syntax:

```gosu
uses java.lang.annotation.ElementType
uses java.lang.annotation.Retention
uses java.lang.annotation.Target

@Target({ElementType.TYPE})
@Retention(RUNTIME)
annotation <ANNOTATION_NAME> {

	/* Only use this if you want to associate an interface with the annotation.
	function implementInterface() : String = "<FULLY_QUALIFIED_INTERFACE_NAME>"
	*/

}
```

| Token                          | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| ANNOTATION_NAME                | A descriptive annotation to group a number of classes.       |
| FULLY_QUALIFIED_INTERFACE_NAME | A required interface that must be implemented along side tagging the class with the ANNOTATION_NAME. This must be assigned to the function implementInterface() .  The function declaration inside the annotation definition is option. |

## GScanner.Instance

The **Instance static property** of **GScanner class** is only way to have an instance of itself.

## GScanner Instance Methods/Property

| Methods/Property                                             | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **clearCache**()                                             | Clears the cache of the registry.                            |
| **clearCacheByType**&lt;TYPE_ANNOTATION&gt;(**type** : Type&lt;TYPE_ANNOTATION&gt;) | Clears the cache of the registry of a particular annotation type. |
| **extract**&lt;TYPE_ANNOTATION&gt;(**annotation** : Type&lt;TYPE_ANNOTATION&gt;) : List&lt;IAnnotationMetaBase&gt; | Retrieve from the registry a group of classes marked by a particular annotation. |
| **process**&lt;TYPE_ANNOTATION, TYPE_OBJECT>(**annotation** : Type&lt;TYPE_ANNOTATION&gt;, **exec**(context : Map&lt;String, Object&gt;, annotation : Object, instance : TYPE_OBJECT) : boolean) : IProcessOutput | Process a group of classes marked by a particular annotation one by one through the **exec parameter**. |
| **Registry** : List&lt;IType&gt;                             | Returns all the classes enlisted to the registry.            |

## The exec parameter of the process method

The **exec parameter is a gosu block parameter** that will receive one at a time an instance of annotation and an instance of a class that has it. They are represented by the variables **annotation** and **instance**, respectively. The first parameter of the exec block is a variable called **context**. This holds what state the process methods has gone through and will be part of the **IProcessOutput** return type. 

If you are processing a particular class you have an option to stop the processing or continue with the next class in queue. Return **false** to stop the process method to receive the next class otherwise return **true**. If you return false the **SubStatus** field attached to the IProcessOutput will have the value **ProcessStatus.CUT_SHORT** otherwise it is the same has the **Status** field.

Therefore, the **exec block** is where the effective way to do what you wanted to do to the classes marked by your custom annotation. Check the **Sample Usage** under the **Usage section** below.

## IAnnotationMetaBase Interface

The implementation of this interface holds the mapping of the **instance of the annotation** against the **class type** it was attached.

## IProcessOutput Interface

The implementation of this interface holds the status after completing the execution of the process method. 

###### Properties

| Property      | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| Context       | Holds any states that the process method created or produced deliberately to communicate between classes involved. Remember an annotation can be assigned not just to one class but a can be a bunch of this. The context is the way they can communicate. |
| Status        | The overall status of completing the execution of the process method. |
| SubStatus     | This is normally equal to the overall status except when the exec parameter returns false and causes the process method to CutShort its processing. |
| Error Message | This has value of there's any error that occurs while running the process method. |

## Usage

#### As a Code Dependency to Your Gosu Project

| Property    | Value            |
| ----------- | ---------------- |
| Group ID    | xyz.ronella.gosu |
| Artifact ID | gregistry        |
| Version     | 1.1.0            |

> Using gradle, this can be added as a dependency entry like the following:
>
> ```groovy
> compile group: 'xyz.ronella.gosu', name: 'gregistry', version: '1.1.0'
> ```

#### Sample Usage

###### MyAnnotation Definition

```gosu
uses java.lang.annotation.ElementType
uses java.lang.annotation.Retention
uses java.lang.annotation.Target

@Target({ElementType.TYPE})
@Retention(RUNTIME)
annotation MyAnnotation {
  function name() : String
}
```

###### ManagedClass Definition

```gosu
uses xyz.ronella.gosu.gregistry.IEnlist
uses java.io.Serializable

@MyAnnotation("World")
class ManagedClass implements IEnlist, Serializable {

  function hello(name : String) {
    print("Hello ${name}")
  }

}
```

###### Processing MyAnnotation Classes

```gosu
uses xyz.ronella.gosu.gregistry.GScanner

var output = GScanner.Instance.process<MyAnnotation, ManagedClass>(
    MyAnnotation
    , \ ___ctx, ___annotation, ___instance -> { //Execute logic

  var name : String

  if (___annotation typeis MyAnnotation) {
    name = ___annotation.name()
  }

  if (___instance typeis ManagedClass) {
    ___instance.hello(name)
  }

  return true
})
```

***The output will be as follows***

```gosu
Hello World
```

> The **Hello part** of the output is **coming from the ManagedClass** itself while the **World part** is coming from the **annotation attached** to the ManagedClass.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## [Build](BUILD.md)

## [Changelog](CHANGELOG.md)

## Author

* Ronaldo Webb
