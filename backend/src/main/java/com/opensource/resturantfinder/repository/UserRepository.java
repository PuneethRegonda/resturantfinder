package com.opensource.resturantfinder.repository;

import com.opensource.resturantfinder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}