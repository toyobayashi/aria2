import { _require } from './require'

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
// Copyright (c) 2019 Denolibs authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function validateIntegerRange (
  value: number,
  name: string,
  min = -2147483648,
  max = 2147483647
): void {
  // The defaults for min and max correspond to the limits of 32-bit integers.
  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be 'an integer' but was ${value}`)
  }
  if (value < min || value > max) {
    throw new Error(
      `${name} must be >= ${min} && <= ${max}.  Value was ${value}`
    )
  }
}

function assert (expr: unknown, msg = ''): asserts expr {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!expr) {
    throw new Error(msg)
  }
}

interface WrappedFunction extends Function {
  listener: Function
}

class EventEmitter {
  public static defaultMaxListeners = 10
  public static errorMonitor = Symbol('events.errorMonitor')
  private maxListeners: number | undefined
  private readonly _events: Map<string | symbol, Array<Function | WrappedFunction>>

  public constructor () {
    this._events = new Map()
  }

  private _addListener (
    eventName: string | symbol,
    listener: Function | WrappedFunction,
    prepend: boolean
  ): this {
    this.emit('newListener', eventName, listener)
    if (this._events.has(eventName)) {
      const listeners = this._events.get(eventName) as Array<
      Function | WrappedFunction
      >
      if (prepend) {
        listeners.unshift(listener)
      } else {
        listeners.push(listener)
      }
    } else {
      this._events.set(eventName, [listener])
    }
    const max = this.getMaxListeners()
    if (max > 0 && this.listenerCount(eventName) > max) {
      const warning = new Error(
        `Possible EventEmitter memory leak detected.
         ${this.listenerCount(eventName)} ${eventName.toString()} listeners.
         Use emitter.setMaxListeners() to increase limit`
      )
      warning.name = 'MaxListenersExceededWarning'
      console.warn(warning)
    }

    return this
  }

  /** Alias for emitter.on(eventName, listener). */
  public addListener (
    eventName: string | symbol,
    listener: Function | WrappedFunction
  ): this {
    return this._addListener(eventName, listener, false)
  }

  /**
   * Synchronously calls each of the listeners registered for the event named
   * eventName, in the order they were registered, passing the supplied
   * arguments to each.
   * @returns true if the event had listeners, false otherwise
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public emit (eventName: string | symbol, ...args: any[]): boolean {
    if (this._events.has(eventName)) {
      if (
        eventName === 'error' &&
        this._events.get(EventEmitter.errorMonitor) != null
      ) {
        this.emit(EventEmitter.errorMonitor, ...args)
      }
      const listeners = (this._events.get(eventName) as Function[]).slice() // We copy with slice() so array is not mutated during emit
      for (const listener of listeners) {
        try {
          listener.apply(this, args)
        } catch (err) {
          this.emit('error', err)
        }
      }
      return true
    } else if (eventName === 'error') {
      if (this._events.get(EventEmitter.errorMonitor) != null) {
        this.emit(EventEmitter.errorMonitor, ...args)
      }
      const errMsg = args.length > 0 ? args[0] : Error('Unhandled error.')
      throw errMsg
    }
    return false
  }

  /**
   * Returns an array listing the events for which the emitter has
   * registered listeners.
   */
  public eventNames (): [string | symbol] {
    return Array.from(this._events.keys()) as [string | symbol]
  }

  /**
   * Returns the current max listener value for the EventEmitter which is
   * either set by emitter.setMaxListeners(n) or defaults to
   * EventEmitter.defaultMaxListeners.
   */
  public getMaxListeners (): number {
    return this.maxListeners ?? EventEmitter.defaultMaxListeners
  }

  /**
   * Returns the number of listeners listening to the event named
   * eventName.
   */
  public listenerCount (eventName: string | symbol): number {
    if (this._events.has(eventName)) {
      return (this._events.get(eventName) as Function[]).length
    } else {
      return 0
    }
  }

  private _listeners (
    target: EventEmitter,
    eventName: string | symbol,
    unwrap: boolean
  ): Function[] {
    if (!target._events.has(eventName)) {
      return []
    }
    const eventListeners: Function[] = target._events.get(
      eventName
    ) as Function[]

    return unwrap
      ? this.unwrapListeners(eventListeners)
      : eventListeners.slice(0)
  }

  private unwrapListeners (arr: Function[]): Function[] {
    const unwrappedListeners: Function[] = new Array(arr.length) as Function[]
    for (let i = 0; i < arr.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      unwrappedListeners[i] = typeof (arr[i] as any).listener === 'function' ? (arr[i] as any).listener : arr[i]
    }
    return unwrappedListeners
  }

  /** Returns a copy of the array of listeners for the event named eventName. */
  public listeners (eventName: string | symbol): Function[] {
    return this._listeners(this, eventName, true)
  }

  /**
   * Returns a copy of the array of listeners for the event named eventName,
   * including any wrappers (such as those created by .once()).
   */
  public rawListeners (
    eventName: string | symbol
  ): Array<Function | WrappedFunction> {
    return this._listeners(this, eventName, false)
  }

  /** Alias for emitter.removeListener(). */
  public off (eventName: string | symbol, listener: Function): this {
    return this.removeListener(eventName, listener)
  }

  /**
   * Adds the listener function to the end of the listeners array for the event
   *  named eventName. No checks are made to see if the listener has already
   * been added. Multiple calls passing the same combination of eventName and
   * listener will result in the listener being added, and called, multiple
   * times.
   */
  public on (
    eventName: string | symbol,
    listener: Function | WrappedFunction
  ): this {
    return this.addListener(eventName, listener)
  }

  /**
   * Adds a one-time listener function for the event named eventName. The next
   * time eventName is triggered, this listener is removed and then invoked.
   */
  public once (eventName: string | symbol, listener: Function): this {
    const wrapped: WrappedFunction = this.onceWrap(eventName, listener)
    this.on(eventName, wrapped)
    return this
  }

  // Wrapped function that calls EventEmitter.removeListener(eventName, self) on execution.
  private onceWrap (
    eventName: string | symbol,
    listener: Function
  ): WrappedFunction {
    const wrapper = function (
      this: {
        eventName: string | symbol
        listener: Function
        rawListener: Function
        context: EventEmitter
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any[]
    ): void {
      this.context.removeListener(this.eventName, this.rawListener)
      this.listener.apply(this.context, args)
    }
    const wrapperContext = {
      eventName: eventName,
      listener: listener,
      rawListener: (wrapper as unknown) as WrappedFunction,
      context: this
    }
    const wrapped = (wrapper.bind(
      wrapperContext
    ) as unknown) as WrappedFunction
    wrapperContext.rawListener = wrapped
    wrapped.listener = listener
    return wrapped
  }

  /**
   * Adds the listener function to the beginning of the listeners array for the
   *  event named eventName. No checks are made to see if the listener has
   * already been added. Multiple calls passing the same combination of
   * eventName and listener will result in the listener being added, and
   * called, multiple times.
   */
  public prependListener (
    eventName: string | symbol,
    listener: Function | WrappedFunction
  ): this {
    return this._addListener(eventName, listener, true)
  }

  /**
   * Adds a one-time listener function for the event named eventName to the
   * beginning of the listeners array. The next time eventName is triggered,
   * this listener is removed, and then invoked.
   */
  public prependOnceListener (
    eventName: string | symbol,
    listener: Function
  ): this {
    const wrapped: WrappedFunction = this.onceWrap(eventName, listener)
    this.prependListener(eventName, wrapped)
    return this
  }

  /** Removes all listeners, or those of the specified eventName. */
  public removeAllListeners (eventName?: string | symbol): this {
    if (this._events === undefined) {
      return this
    }

    if (eventName != null && eventName !== '') {
      if (this._events.has(eventName)) {
        const listeners = (this._events.get(eventName) as Array<Function | WrappedFunction>).slice() // Create a copy; We use it AFTER it's deleted.
        this._events.delete(eventName)
        for (const listener of listeners) {
          this.emit('removeListener', eventName, listener)
        }
      }
    } else {
      const eventList: [string | symbol] = this.eventNames()
      eventList.map((value: string | symbol) => {
        this.removeAllListeners(value)
      })
    }

    return this
  }

  /**
   * Removes the specified listener from the listener array for the event
   * named eventName.
   */
  public removeListener (eventName: string | symbol, listener: Function): this {
    if (this._events.has(eventName)) {
      const arr:
      | Array<Function | WrappedFunction>
      | undefined = this._events.get(eventName)

      assert(arr)

      let listenerIndex = -1
      for (let i = arr.length - 1; i >= 0; i--) {
        // arr[i]["listener"] is the reference to the listener inside a bound 'once' wrapper
        if (
          arr[i] === listener ||
          (arr[i] != null && (arr[i] as WrappedFunction).listener === listener)
        ) {
          listenerIndex = i
          break
        }
      }

      if (listenerIndex >= 0) {
        arr.splice(listenerIndex, 1)
        this.emit('removeListener', eventName, listener)
        if (arr.length === 0) {
          this._events.delete(eventName)
        }
      }
    }
    return this
  }

  /**
   * By default EventEmitters will print a warning if more than 10 listeners
   * are added for a particular event. This is a useful default that helps
   * finding memory leaks. Obviously, not all events should be limited to just
   * 10 listeners. The emitter.setMaxListeners() method allows the limit to be
   * modified for this specific EventEmitter instance. The value can be set to
   * Infinity (or 0) to indicate an unlimited number of listeners.
   */
  public setMaxListeners (n: number): this {
    validateIntegerRange(n, 'maxListeners', 0)
    this.maxListeners = n
    return this
  }
}

/**
 * See also https://nodejs.org/api/events.html
 * @public
 */
let _EventEmitter: typeof NodeJS.EventEmitter

let events: any = {}

if (_require != null) {
  try {
    events = _require('events')
    _EventEmitter = events.EventEmitter || EventEmitter
  } catch (_) {
    _EventEmitter = EventEmitter
  }
} else {
  _EventEmitter = EventEmitter
}

export default _EventEmitter

export {
  _EventEmitter as EventEmitter
}
