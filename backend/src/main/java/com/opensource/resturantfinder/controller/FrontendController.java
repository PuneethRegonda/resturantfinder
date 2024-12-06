package com.opensource.resturantfinder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {
    @GetMapping(value = {"/{path:[^\\.]*}"})
    public String redirect() {
        // Forward to index.html
        return "forward:/index.html";
    }
}
