CREATE DATABASE ShvaTransactionsDB;


CREATE TABLE Transactions (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    Amount DECIMAL(18,2) NOT NULL,

    Country NVARCHAR(100) NOT NULL,

    RequestedAtUtc DATETIME2 NOT NULL,

    Status NVARCHAR(20) NOT NULL
        CHECK (Status IN ('Approved', 'Rejected')),

    CreatedAt DATETIME2 NOT NULL
        DEFAULT GETUTCDATE()
);

CREATE INDEX IX_Transactions_Status
ON Transactions(Status);

CREATE INDEX IX_Transactions_RequestedAtUtc
ON Transactions(RequestedAtUtc);
GO

