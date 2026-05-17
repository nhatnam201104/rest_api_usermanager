package com.example.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void set(@NonNull String key, @NonNull Object value) {
        redisTemplate.opsForValue().set(key, value);
        
    }

    public void set(@NonNull String key, @NonNull Object value, @NonNull Duration ttl) {
        redisTemplate.opsForValue().set(key, value, ttl);
    }

    public Object get(@NonNull String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public Boolean delete(@NonNull String key) {
        return redisTemplate.delete(key);
    }

    public Boolean exists(@NonNull String key) {
        return redisTemplate.hasKey(key);
    }
}