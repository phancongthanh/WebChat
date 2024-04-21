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
    internal class PhoneNumberResource {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal PhoneNumberResource() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("WebChat.Application.Common.Resources.PhoneNumberResource", typeof(PhoneNumberResource).Assembly);
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
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Mã quốc gia.
        /// </summary>
        internal static string CountryCode {
            get {
                return ResourceManager.GetString("CountryCode", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Mã quốc gia không được dài quá 3 chữ số.
        /// </summary>
        internal static string CountryCodeLength {
            get {
                return ResourceManager.GetString("CountryCodeLength", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Số điện thoại không được để trống.
        /// </summary>
        internal static string EmptyPhoneNumber {
            get {
                return ResourceManager.GetString("EmptyPhoneNumber", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Số điện thoại không hợp lệ.
        /// </summary>
        internal static string Invalid {
            get {
                return ResourceManager.GetString("Invalid", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Mã quốc gia phải là một số [000, 999]..
        /// </summary>
        internal static string InvalidCountryCode {
            get {
                return ResourceManager.GetString("InvalidCountryCode", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Số đăng ký phải là một số có từ 7 đến 15 chứ số..
        /// </summary>
        internal static string InvalidSubcriberNumber {
            get {
                return ResourceManager.GetString("InvalidSubcriberNumber", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Mã quốc gia phải là các chữ số.
        /// </summary>
        internal static string NonDigitCountryCode {
            get {
                return ResourceManager.GetString("NonDigitCountryCode", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Số thuê bao phải là các chữ số.
        /// </summary>
        internal static string NonDigitSubscriberNumber {
            get {
                return ResourceManager.GetString("NonDigitSubscriberNumber", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Số điện thoại.
        /// </summary>
        internal static string SubcriberNumber {
            get {
                return ResourceManager.GetString("SubcriberNumber", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Số thuê bao phải có độ dài từ 7 đến 15 chữ số.
        /// </summary>
        internal static string SubscriberNumberLength {
            get {
                return ResourceManager.GetString("SubscriberNumberLength", resourceCulture);
            }
        }
    }
}
