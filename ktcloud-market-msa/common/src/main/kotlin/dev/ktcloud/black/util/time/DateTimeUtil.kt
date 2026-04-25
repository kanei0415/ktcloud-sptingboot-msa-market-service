package dev.ktcloud.black.util.time

import java.time.LocalDateTime

fun now(): LocalDateTime {
    return LocalDateTime.now(MicrosecondTruncatingClock.Instance)
}