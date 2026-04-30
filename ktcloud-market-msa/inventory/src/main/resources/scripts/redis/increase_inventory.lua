local current = redis.call('get', KEYS[1])

if not current then
    return -1
end

return redis.call('incrby', KEYS[1], ARGV[1])