﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebChat.Application.Common.Resources {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class MessageResource___Copy {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal MessageResource___Copy() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("WebChat.Application.Common.Resources.MessageResource - Copy", typeof(MessageResource___Copy).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Tệp tin.
        /// </summary>
        public static string File {
            get {
                return ResourceManager.GetString("File", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Người dùng không thể xóa tin nhắn của người khác.
        /// </summary>
        public static string IsNotSender {
            get {
                return ResourceManager.GetString("IsNotSender", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Tin nhắn.
        /// </summary>
        public static string Message {
            get {
                return ResourceManager.GetString("Message", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Tệp tin dung lượng quá lớn.
        /// </summary>
        public static string TooLargeFileSize {
            get {
                return ResourceManager.GetString("TooLargeFileSize", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Có quá nhiều tệp tin trong một tin nhắn.
        /// </summary>
        public static string TooManyFiles {
            get {
                return ResourceManager.GetString("TooManyFiles", resourceCulture);
            }
        }
    }
}
