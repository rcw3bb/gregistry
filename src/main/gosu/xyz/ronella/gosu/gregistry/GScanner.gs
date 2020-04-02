package xyz.ronella.gosu.gregistry

uses java.io.Serializable
uses java.util.concurrent.locks.ReentrantLock
uses java.lang.Thread
uses java.util.ArrayList
uses java.util.Map
uses java.lang.Exception

uses gw.lang.reflect.ReflectUtil
uses gw.lang.reflect.IType

uses org.slf4j.Logger
uses org.slf4j.LoggerFactory
uses xyz.ronella.gosu.gcache.ConcurrentLRUCache

/**
 * A utility class of retrieving annotated classes.
 * @author Ron Webb
 * @since 2016-06-20
 */
class GScanner {

  /**
   * The field for storing the processing status.
   */
  public static final var CTX_STATUS : String = "xyz.ronella.gosu.gregistry.GScanner.CTX_STATUS"
  
  /**
   * The field for storing the sub processing status.
   */
  public static final var CTX_SUB_STATUS : String = "xyz.ronella.gosu.gregistry.GScanner.CTX_SUB_STATUS"

  /**
   * The field for storing the error message.
   */
  public static final var CTX_ERROR_MSG : String = "xyz.ronella.gosu.gregistry.GScanner.CTX_ERROR_MSG"

  /**
   * The field for storing the current count of the class that is being processed.
   */
  public static final var CTX_CLASS_INDEX : String = "xyz.ronella.gosu.gregistry.GScanner.CTX_CLASS_INDEX"
  
  private final static var LOG : Logger = LoggerFactory.getLogger("GScanner")
  private static var ANNOTATION_UTIL : GScanner
  private static final var LOCK_CLASS = new ReentrantLock()
  private static var _monitorFlag : boolean as readonly Monitor = false
  private static final var MONITOR_MAX_RETRY : int = 10

  private static var CACHE_REGISTRY_IS_LOADED : boolean
  private static final var CACHE_REGISTRY_CACHE_SIZE = 10000
  private static final var CACHE_REGISTRY_CODE = "GSCANNER_REGISTRY"
  private static final var CACHE_REGISTRY = new ConcurrentLRUCache<String, IType>(CACHE_REGISTRY_CODE, CACHE_REGISTRY_CACHE_SIZE)

  private static class MonitorLock {
    construct() {
      using(LOCK_CLASS) {
        _monitorFlag = true
      }
    }
    
    public function close() {
      using(LOCK_CLASS) {
        _monitorFlag = false
      }
    }
  }
  
  private construct() {
  }
  
  /**
   * Generates a singleton instance of GScanner.
   * @return An instance of GScanner
   */
  public static property get Instance() : GScanner {
    if (GScanner.ANNOTATION_UTIL==null) {
      using(LOCK_CLASS) {
        if (GScanner.ANNOTATION_UTIL==null) {
          GScanner.ANNOTATION_UTIL = new GScanner()
        }
      }
    }
    return GScanner.ANNOTATION_UTIL
  }
  
  /**
   * The method for extracting gregistry.
   * @param annotation The type of the gregistry.
   * @return A collection of an instance of IAnnotationMeta.
   */
  public reified function extract<TYPE_ANNOTATION>(_annotation : Type<TYPE_ANNOTATION>) : List<IAnnotationMetaBase> {
    return extract(_annotation, AnnotationProcessorArbiter.processor(_annotation).defaultAnnotationMetaBase())
  }

  private function waiter() {
    using(LOCK_CLASS) {
      var monitorRetry = 0
      while (_monitorFlag && monitorRetry < MONITOR_MAX_RETRY) {// wait to complete processing.
        Thread.sleep(1000)
        monitorRetry++
      }

      if (monitorRetry == MONITOR_MAX_RETRY) {
        throw new ExtractionTimeoutException("Maximum retry reached.")
      }
    }
  }

  /**
   * Returns all of the enlisted (i.e. marked as IEnlist) classes.
   *
   * @return A list of registered classes.
   *
   * @author Ron Webb
   * @since 2020-03-30
   */
  public property get Registry() : List<IType> {
    if (!CACHE_REGISTRY_IS_LOADED) {
      using (LOCK_CLASS) {
        if (!CACHE_REGISTRY_IS_LOADED) {
          IEnlist.Type.Subtypes.each(\ ___type -> {
            CACHE_REGISTRY.put(___type.Name, ___type)
          })
          CACHE_REGISTRY_IS_LOADED = true
        }
      }
    }
    return CACHE_REGISTRY.values()?.toList()
  }

  /**
   * The method for extracting gregistry.
   * @param annotation The type of the gregistry.
   * @param annotationMeta A subtype of AbstractAnnotationMeta to override the default generation of IAnnotationMeta.
   * @return A collection of an instance of IAnnotationMeta.
   */  
  public reified function extract<TYPE_ANNOTATION>(_annotation : Type<TYPE_ANNOTATION>, annotationMeta : Type<AbstractAnnotationMetaBase>) : List<IAnnotationMetaBase> {
    LOG.debug("public function extract<TYPE_ANNOTATION>(_annotation : Type<TYPE_ANNOTATION>, annotationMeta : Type<AbstractAnnotationMetaBase>) : List<IAnnotationMetaBase>")

    waiter()

    var processor = AnnotationProcessorArbiter.processor(_annotation)
    var annotationMetas = processor.retrieveMeta(_annotation)
    
    if (_annotation==null || annotationMeta==null) {
      return annotationMetas
    }
    
    if (annotationMetas!=null) {
      LOG.debug("Annotation cache hit " + _annotation)
    }
    
    if (annotationMetas==null) {
      using(LOCK_CLASS) {
        if (annotationMetas==processor.retrieveMeta(_annotation)) {
          using(new MonitorLock()) {

            var cacheMetas = \ -> {
              if (annotationMetas==null) {
                annotationMetas = new ArrayList<IAnnotationMeta>()
                LOG.info("Caching [${processor.Version}] ${_annotation.Type.Name}")
                processor.storeMeta(_annotation, annotationMetas)
              }            
            }

            Registry.where(\__type -> __type.TypeInfo.getAnnotation(_annotation)!=null)?.each(\ __type -> {
              var fqClassName = __type?.Name
              var annotationInstance = processor.annotationInfoInstance(__type, _annotation)
              
              if (!(annotationInstance typeis Serializable)) {
                throw new ObjectMustBeSerializableException(fqClassName)
              }
              
              var annotationMetaName = annotationMeta?.Type?.Name
              var annotationMetaInstance = ReflectUtil.construct(annotationMetaName, {}) as AbstractAnnotationMetaBase
            
              annotationMetas = processor.retrieveMeta(_annotation)
      
              cacheMetas()
            
              annotationMetaInstance.AnnotationInfo = annotationInstance
              annotationMetaInstance.ClassType = __type

              annotationMetas.add(annotationMetaInstance)
            })
          
            //Cache empty if no classes were marked by the gregistry.
            cacheMetas()
          }
        }
      }
    }
  
    return annotationMetas
  }
  
  /**
   * Method for the clearing the whole cache.
   */
  public static function clearCache() {
    using(LOCK_CLASS) {
      AnnotationProcessorArbiter.clear()
      CACHE_REGISTRY.clear()
      CACHE_REGISTRY_IS_LOADED = false
    }
  }
  
  /**
   * Method for clearing gregistry specific type and delete all the cached instance based on it.
   * 
   * @param pType The type of the gregistry.
   * @author Ron Webb
   * @since 2017-03-2017
   */
  public reified static function clearCacheByType<TYPE_ANNOTATION>(pType : Type<TYPE_ANNOTATION>) {
    AnnotationProcessorArbiter.processor(pType).clearByType(pType)
  }

  /**
   * A method for processing the gregistry and its associated class instance. This is always caching.
   * @param exec(context, annotationInstance, classInstance) The function to execute for each instance of associated class with the gregistry.
   * @return An instance of IProcessOutput (i.e. IProcessOutput.Status==ProcessStatus.NORMAL_TERMINATION if everything is successful).
   * @author Ron Webb
   * @since 2020-04-02
   */
  public reified function process<TYPE_ANNOTATION, TYPE_OBJECT>(
      exec(___ctx : Map<String, Object>, ___annotation : TYPE_ANNOTATION, obj : TYPE_OBJECT) : boolean) : IProcessOutput {
    return process<TYPE_ANNOTATION, TYPE_OBJECT>(TYPE_ANNOTATION, {}, exec)
  }

  /**
   * A method for processing the gregistry and its associated class instance. This is always caching.
   * @param annotation The type of gregistry.
   * @param exec(context, annotationInstance, classInstance) The function to execute for each instance of associated class with the gregistry.
   * @return An instance of IProcessOutput (i.e. IProcessOutput.Status==ProcessStatus.NORMAL_TERMINATION if everything is successful).
   * @author Ron Webb
   * @since 2016-06-30
   */
  public reified function process<TYPE_ANNOTATION, TYPE_OBJECT>(
      _annotation : Type<TYPE_ANNOTATION>
    , exec(___ctx : Map<String, Object>, ___annotation : TYPE_ANNOTATION, obj : TYPE_OBJECT) : boolean) : IProcessOutput {
    return process<TYPE_ANNOTATION, TYPE_OBJECT>(_annotation, {}, exec)
  }
  
  /**
   * A method for processing the gregistry and its associated class instance.
   * @param annotation The type of gregistry.
   * @param exec(context, annotationInstance, classInstance) The function to execute for each instance of associated class with the gregistry.
   * @param shouldCache Set this to true to cache the instance of the associated class with the gregistry.
   * @return An instance of IProcessOutput (i.e. IProcessOutput.Status==ProcessStatus.NORMAL_TERMINATION if everything is successful).
   * @author Ron Webb
   * @since 2016-06-30
   */
  public reified function process<TYPE_ANNOTATION, TYPE_OBJECT>(
      _annotation : Type<TYPE_ANNOTATION>
    , exec(___ctx : Map<String, Object>, ___annotation : TYPE_ANNOTATION, obj : TYPE_OBJECT) : boolean
    , shouldCache : boolean) : IProcessOutput {
    return process<TYPE_ANNOTATION, TYPE_OBJECT>(_annotation, {}, exec, shouldCache)
  }  

  /**
   * A method for processing the gregistry and its associated class instance. This is always caching.
   * @param annotation The type of gregistry.
   * @param ctx The context to operate with.
   * @param exec(context, annotationInstance, classInstance) The function to execute for each instance of associated class with the gregistry.
   * @return An instance of IProcessOutput (i.e. IProcessOutput.Status==ProcessStatus.NORMAL_TERMINATION if everything is successful).
   * @author Ron Webb
   * @since 2016-06-30
   */
   public reified function process<TYPE_ANNOTATION, TYPE_OBJECT>(
       _annotation : Type<TYPE_ANNOTATION>
    , ctx : Map<String, Object>
    , exec(___ctx : Map<String, Object>, ___annotation : TYPE_ANNOTATION, obj : TYPE_OBJECT) : boolean) : IProcessOutput {
    return process<TYPE_ANNOTATION, TYPE_OBJECT>(_annotation, AnnotationProcessorArbiter.processor(_annotation).defaultAnnotationMetaBase(), ctx, exec)
  }
  
  /**
   * A method for processing the gregistry and its associated class instance.
   * @param annotation The type of gregistry.
   * @param ctx The context to operate with.
   * @param exec(context, annotationInstance, classInstance) The function to execute for each instance of associated class with the gregistry.
   * @param shouldCache Set this to true to cache the instance of the associated class with the gregistry.
   * @return An instance of IProcessOutput (i.e. IProcessOutput.Status==ProcessStatus.NORMAL_TERMINATION if everything is successful).
   * @author Ron Webb
   * @since 2016-06-30
   */  
  public reified function process<TYPE_ANNOTATION, TYPE_OBJECT>(
      _annotation : Type<TYPE_ANNOTATION>
    , ctx : Map<String, Object>
    , exec(___ctx : Map<String, Object>, ___annotation : TYPE_ANNOTATION, obj : TYPE_OBJECT) : boolean
    , shouldCache : boolean) : IProcessOutput {
    return process<TYPE_ANNOTATION, TYPE_OBJECT>(_annotation, AnnotationProcessorArbiter.processor(_annotation).defaultAnnotationMetaBase(), ctx, exec, shouldCache)
  }  
  
  /**
   * A method for processing the gregistry and its associated class instance. This is always caching.
   * @param annotation The type of gregistry.
   * @param annotationMeta The class to be created to all the gregistry metadata.
   * @param ctx The context to operate with.
   * @param exec(context, annotationInstance, classInstance) The function to execute for each instance of associated class with the gregistry.
   * @return An instance of IProcessOutput (i.e. IProcessOutput.Status==ProcessStatus.NORMAL_TERMINATION if everything is successful).
   * @author Ron Webb
   * @since 2016-06-30
   */
  public reified function process<TYPE_ANNOTATION, TYPE_OBJECT>(
      _annotation : Type<TYPE_ANNOTATION>
    , annotationMeta : Type<AbstractAnnotationMetaBase>
    , ctx : Map<String, Object>
    , exec(___ctx : Map<String, Object>, ___annotation : TYPE_ANNOTATION, obj : TYPE_OBJECT) : boolean) : IProcessOutput {
    return process<TYPE_ANNOTATION, TYPE_OBJECT>(_annotation, annotationMeta, ctx, exec, true)
  }

  /**
   * A method for processing the gregistry and its associated class instance.
   * @param annotation The type of gregistry.
   * @param annotationMeta The class to be created to all the gregistry metadata.
   * @param ctx The context to operate with.
   * @param exec(context, annotationInstance, classInstance) The function to execute for each instance of associated class with the gregistry.
   * @param shouldCache Set this to true to cache the instance of the associated class with the gregistry.
   * @return An instance of IProcessOutput (i.e. IProcessOutput.Status==ProcessStatus.NORMAL_TERMINATION if everything is successful).
   * @author Ron Webb
   * @since 2016-06-30
   */
  public reified function process<TYPE_ANNOTATION, TYPE_OBJECT>(
      _annotation : Type<TYPE_ANNOTATION>
    , annotationMeta : Type<AbstractAnnotationMetaBase>
    , ctx : Map<String, Object>
    , exec(___ctx : Map<String, Object>, ___annotation : TYPE_ANNOTATION, obj : TYPE_OBJECT) : boolean
    , shouldCache : boolean) : IProcessOutput {
    var processor = AnnotationProcessorArbiter.processor(_annotation)

    ctx=ctx?:{}
    ctx.put(GScanner.CTX_STATUS, ProcessStatus.IDLE)
    
    var metas = GScanner.Instance.extract<TYPE_ANNOTATION>(_annotation, annotationMeta)
    if (metas!=null) {
      for (___meta in metas) {
        ctx.put(GScanner.CTX_STATUS, ProcessStatus.PROCESSING)
        ctx.put(GScanner.CTX_CLASS_INDEX, (ctx.getOrDefault(GScanner.CTX_CLASS_INDEX, 0) as int) + 1)
        var __annotation = ___meta.AnnotationInfo
        var classType = ___meta.ClassType
        var className = classType.Name
        var objInstance : Object = processor.retrieveInstance(className)
      
        if (LOG.DebugEnabled && objInstance!=null) {
          LOG.debug("Cache HIT for " + className)
        }
        
        if (objInstance!=null && !shouldCache) {
          objInstance=null
        }
    
        if (objInstance==null) {
          LOG.debug("Cache MISS for " + className)
          objInstance = ReflectUtil.construct(className, {})
          
          if (!(objInstance typeis Serializable)) {
            throw new ObjectMustBeSerializableException(className)
          }

          processor.validate(ctx, classType, _annotation)

          if (shouldCache) {
            using(LOCK_CLASS) {
              processor.storeInstance(className, objInstance)
            }
          }
        }
        try {
          try {
            if (!exec(ctx, __annotation as TYPE_ANNOTATION, objInstance as TYPE_OBJECT)) {
              ctx.put(GScanner.CTX_SUB_STATUS, ProcessStatus.CUT_SHORT)
              break
            }
          }
          catch(exp : Exception) {
            LOG.error(exp.StackTraceAsString)
            throw new ProcessException(exp.Message?:"Check log file for " + className + " unhandled exception.")
          }
        }
        catch (pe : ProcessException) {
          ctx.put(GScanner.CTX_STATUS, ProcessStatus.ERROR)
          ctx.put(GScanner.CTX_ERROR_MSG, pe.Message?:"Error processing " + className)
          LOG.error(pe.StackTraceAsString)
          break
        }
      }
    }
    return new ProcessOutput(ctx)
  }

  private static class ProcessOutput implements IProcessOutput {

    private var _context : Map<String, Object>

    construct(context : Map<String, Object>) {
      this._context = context

      if ((_context.get(GScanner.CTX_STATUS) as ProcessStatus) != ProcessStatus.ERROR) {
        _context.put(GScanner.CTX_STATUS, ProcessStatus.NORMAL_TERMINATION)
      }

      if (_context.get(GScanner.CTX_SUB_STATUS)==null) {
        _context.put(GScanner.CTX_SUB_STATUS, _context.get(GScanner.CTX_STATUS))
      }
    }

    override property get Context() : Map<String, Object> {
      return _context
    }

    override property get Status() : ProcessStatus {
      return _context.get(GScanner.CTX_STATUS) as ProcessStatus
    }

    override property get SubStatus() : ProcessStatus {
      return _context.get(GScanner.CTX_SUB_STATUS) as ProcessStatus
    }

    override property get ErrorMessage() : String {
      return _context.get(GScanner.CTX_ERROR_MSG) as String
    }
  }

}
