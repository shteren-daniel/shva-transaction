using System.Data;

namespace server.Data;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}