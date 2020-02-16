﻿using Infrastructure.HandlerBase;

namespace Infrastructure.CommandBase
{
    /// <summary>
    /// Base interface for query
    /// </summary>
    /// <typeparam name="TOut">TOut</typeparam>
    public interface IQuery<TOut>
    { }

    /// <summary>
    /// Base Query handler
    /// </summary>
    /// <typeparam name="TIn">TIn</typeparam>
    /// <typeparam name="TOut">TOut</typeparam>
    public interface IQueryHandler<in TIn, out TOut, out TExecute>
        : IHandler<TIn, TOut>
        where TIn : IQuery<TOut>
    {
        /// <summary>
        /// Query perfomer
        /// </summary>
        /// <param name="command">TIn command</param>
        TExecute Execute(TIn query);
    }

    /// <summary>
    /// Base interface for query dispatcher
    /// </summary>
    public interface IQueryDispatcher
    {
        /// <summary>
        /// Dispatcher handler
        /// </summary>
        /// <typeparam name="TIn">TIn</typeparam>
        /// <typeparam name="Tout">TOut</typeparam>
        /// <param name="command">TIn query</param>
        void Handle<TIn, Tout>(TIn command) where TIn : IQuery<Tout>;
    }
}
