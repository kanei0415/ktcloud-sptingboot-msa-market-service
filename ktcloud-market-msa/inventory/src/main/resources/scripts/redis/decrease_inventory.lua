local current = redis.call('get', KEYS[1])

if not current then
    return -1
end

if tonumber(current) < tonumber(ARGV[1]) then
    return -2
end

return redis.call('decrby', KEYS[1], ARGV[1])