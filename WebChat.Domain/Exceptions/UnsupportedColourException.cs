﻿namespace WebChat.Domain.Exceptions;

public class UnsupportedColourException(string code)
    : Exception($"Colour \"{code}\" is unsupported.")
{
    public string Code { get; } = code;
}
