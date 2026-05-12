using System.Data;
using Microsoft.Data.SqlClient;

namespace server.Data;

public class SqlConnectionFactory : IDbConnectionFactory
{
    private readonly IConfiguration _config;

    public SqlConnectionFactory(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection CreateConnection()
    {
        return new SqlConnection(
            _config.GetConnectionString("DefaultConnection"));
    }
}