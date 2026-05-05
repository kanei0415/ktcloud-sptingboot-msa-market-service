local exists = redis.call('EXISTS', KEYS[1])

if exists == 0 then
    return -1
end

local new_stock = redis.call('HINCRBY', KEYS[1], 'quantity', ARGV[1])

local eventId = math.max(tonumber(lastEventId), tonumber(ARGV[2]))

redis.call('HSET', KEYS[1], 'lastEventId', toString(eventId))

return new_stock