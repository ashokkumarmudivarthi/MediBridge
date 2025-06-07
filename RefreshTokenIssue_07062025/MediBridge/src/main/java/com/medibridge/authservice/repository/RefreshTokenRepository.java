package com.medibridge.authservice.repository;

import com.medibridge.authservice.model.RefreshToken;
import com.medibridge.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/*public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    int deleteByUser(User user);
}*/


public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(User user);
    int deleteByUser(User user);
}
