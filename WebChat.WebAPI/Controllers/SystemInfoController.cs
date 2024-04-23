using Microsoft.AspNetCore.Mvc;
using WebChat.Application.Common.Models;

namespace WebChat.WebAPI.Controllers;

public class SystemInfoController(SystemInfoOptions systemInfo) : ApiControllerBase
{
    [HttpGet]
    public SystemInfoOptions Get()
    {
        return systemInfo;
    }
}
