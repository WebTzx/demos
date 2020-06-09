const bindContext = function (...arg) {
    const [ that, ...other ] = arg;
     const context = this;
    console.log(this, that);
    return (...FcnArg) => context.apply(that, [...other, ...FcnArg])
    
  };
  // 箭头函数会忽略 this
  
  const callContext = function(...arg) {
    const [ context, ...otherArg ] = arg;
    
    const fncKey = Symbol();
    
    context[fncKey] = this;
    
    const res = context[fncKey](...otherArg);
    
    
    delete this[fncKey];
    return res;
  }
  
  const applyContext = function(context = window, otherArg) {
    
    if (!Array.isArray(otherArg)) return new TypeError('arg 不是一个数组')
    const fncKey = Symbol();
    
    context[fncKey] = this;
    
    const res = context[fncKey](...otherArg);
    
    
    delete this[fncKey];
    return res;
  }
  
  const test = function (...arg)  {
    
    console.log(this.id, arg);
  };
  
  Function.prototype.bindContext = bindContext;
  Function.prototype.callContext = callContext;
  Function.prototype.applyContext = applyContext;
  
  const bindThis = test.bind({id: 'bindThis test fcn'}, 1, 2, 3);
  bindThis();
  
  test.applyContext({id: 'call test fnc'}, 1)
    