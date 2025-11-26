import mysql.connector
from mysql.connector import pooling

from config import DB_CONFIG

_connection_pool = None


def _get_connection_pool():
    """
    Initialize the MySQL connection pool once and reuse it across requests.
    mysql.connector raises PoolError if we try to recreate a pool with the
    same name, so we centralize creation here.
    """
    global _connection_pool

    if _connection_pool is None:
        pool_config = DB_CONFIG.copy()

        pool_name = pool_config.pop("pool_name", "vnfood_pool")
        pool_size = pool_config.pop("pool_size", 5)
        pool_reset_session = pool_config.pop("pool_reset_session", True)

        _connection_pool = pooling.MySQLConnectionPool(
            pool_name=pool_name,
            pool_size=pool_size,
            pool_reset_session=pool_reset_session,
            **pool_config,
        )

    return _connection_pool


def get_db_connection():
    try:
        pool = _get_connection_pool()
        conn = pool.get_connection()
        return conn
    except mysql.connector.Error as err:
        print(f"Lỗi kết nối database: {err}")
        return None

