<?php

namespace app\service\model;

use think\Cache;

class Redis extends Cache
{
    //$handler->\Redis

    /**
     * Adds a value to the hash stored at key. If this value is already in the hash, FALSE is returned.
     * @return int|bool
     * 1 if value didn't exist and was added successfully,
     * 0 if the value was already present and was replaced,
     * FALSE if there was an error.
     */
    public static function hSet($key, $hashKey, $value)
    {
        self::$writeTimes++;
        return self::init()->handler()->hset($key, $hashKey, $value);
    }

    /**
     * Gets a value from the hash stored at key.
     * If the hash table doesn't exist, or the key doesn't exist, FALSE is returned.
     *
     * @return  string  The value, if the command executed successfully BOOL FALSE in case of failure
     */
    public static function hGet($key, $hashKey)
    {
        self::$readTimes++;
        return self::init()->handler()->hget($key, $hashKey);
    }

    /**
     * Returns the whole hash, as an array of strings indexed by strings.
     *
     * @param   string $key
     * @return  array   An array of elements, the contents of the hash.
     * The order is random and corresponds to redis' own internal representation of the set structure.
     */
    public static function hGetAll($key)
    {
        self::$readTimes++;
        return self::init()->handler()->hGetAll($key);
    }

    /**
     * Removes a values from the hash stored at key.
     * If the hash table doesn't exist, or the key doesn't exist, FALSE is returned.
     *
     * @return  int|bool     Number of deleted fields, FALSE if table or key doesn't exist
     */
    public static function hDel($key, $hashKey1, $hashKey2 = null, $hashKeyN = null)
    {
        self::$writeTimes++;
        return self::init()->handler()->hDel($key, $hashKey1, $hashKey2, $hashKeyN);
    }

    /**
     * Verify if the specified member exists in a key.
     *
     * @return  bool    If the member exists in the hash table, return TRUE, otherwise return FALSE.
     */
    public static function hExists($key, $hashKey)
    {
        self::$readTimes++;
        return self::init()->handler()->hExists($key, $hashKey);
    }

    /**
     * Verify if the specified key exists.
     *
     * @return  bool  If the key exists, return TRUE, otherwise return FALSE.
     */
    public static function exists($key)
    {
        self::$readTimes++;
        return self::init()->handler()->exists($key);
    }
}