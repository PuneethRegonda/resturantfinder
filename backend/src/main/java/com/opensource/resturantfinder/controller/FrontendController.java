package com.opensource.resturantfinder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {
    @GetMapping("/{path:^(?!api).*$}")
    public String forward() {
        return "forward:/index.html";
    }
}
