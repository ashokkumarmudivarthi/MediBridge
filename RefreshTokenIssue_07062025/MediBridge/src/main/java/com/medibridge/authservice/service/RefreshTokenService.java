/*package com.medibridge.authservice.service;

import com.medibridge.authservice.model.User;
import com.medibridge.authservice.model.RefreshToken;
import com.medibridge.authservice.repository.RefreshTokenRepository;
import com.medibridge.authservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${jwt.refresh.expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepo;
    private final UserRepository userRepo;

    public RefreshTokenService(RefreshTokenRepository repo, UserRepository userRepo) {
        this.refreshTokenRepo = repo;
        this.userRepo = userRepo;
    }

    public RefreshToken createRefreshToken(String username) {
        User user = userRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));

        return refreshTokenRepo.save(token);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepo.findByToken(token);
    }

    public boolean isExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return refreshTokenRepo.deleteByUser(user);
    }
}
*/

package com.medibridge.authservice.service;

import com.medibridge.authservice.model.User;
import com.medibridge.authservice.model.RefreshToken;
import com.medibridge.authservice.repository.RefreshTokenRepository;
import com.medibridge.authservice.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${jwt.refresh.expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepo;
    private final UserRepository userRepo;

    // Use @Autowired constructor injection (optional if only one constructor)
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepo, UserRepository userRepo) {
        this.refreshTokenRepo = refreshTokenRepo;
        this.userRepo = userRepo;
    }

    public RefreshToken createRefreshToken(String username) {
        User user = userRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));

        return refreshTokenRepo.save(token);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepo.findByToken(token);
    }

    public boolean isExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return refreshTokenRepo.deleteByUser(user);
    }
}
