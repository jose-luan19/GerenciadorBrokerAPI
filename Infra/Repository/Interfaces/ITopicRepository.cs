﻿using Models;

namespace Infra.Repository.Interfaces
{
    public interface ITopicRepository : IDisposable, IARepository<Topic>
    {
        bool ExistByName(string name);
    }
}
