using Data.Repositories;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Services
{
    public class JournalService : IJournalService
    {
        private readonly IBaseRepository<Journal> _JournalRepository;

        public JournalService(IBaseRepository<Journal> JournalRepository)
        {
            _JournalRepository = JournalRepository;
        }

        public async Task<JournalViewModel> GetById(int id)
        {
            var Journal = await _JournalRepository.GetByIdAsync(id);

            JournalViewModel viewModel = new JournalViewModel
            {
                Id = Journal.Id,
                User_Id = Journal.User_Id,
                Recipe_Id = Journal.Recipe_Id
            };

            return viewModel;
        }

        public async Task<List<JournalViewModel>> GetAll()
        {
            var Journals = await _JournalRepository.GetAllAsync();

            return Journals.Select(r => new JournalViewModel
            {
                Id = r.Id,
                User_Id = r.User_Id,
                Recipe_Id = r.Recipe_Id
            }).ToList();
        }

        public async Task Create(JournalModel model)
        {
            Journal Journal = new Journal
            {
                User_Id = model.User_Id,
                Recipe_Id = model.Recipe_Id
            };
            await _JournalRepository.AddAsync(Journal);




        }

        public async Task Update(int id, JournalModel model)
        {
            var Journal = await _JournalRepository.GetByIdAsync(id);
            if (Journal == null) return;
            Journal.User_Id = model.User_Id;
            Journal.Recipe_Id = model.Recipe_Id;

            await _JournalRepository.UpdateAsync(Journal);

        }

        public async Task Delete(int id)
        {
            var Journal = await _JournalRepository.GetByIdAsync(id);
            if (Journal == null) return;

            await _JournalRepository.DeleteAsync(Journal);
        }
        public async Task<List<JournalViewModel>> GetByUserId(int id)
        {
            var Journals = await _JournalRepository.GetAllAsync();
            List<JournalViewModel> model = new List<JournalViewModel>();
            foreach (var journal in Journals)
            {
                if (journal.User_Id == id)
                    model.Add(new JournalViewModel {User_Id= journal.User_Id, Id=journal.Id, Recipe_Id=journal.Recipe_Id });
            }
            return model;
        }
    }
    public interface IJournalService
    {
        Task<List<JournalViewModel>> GetByUserId(int id);
        Task<JournalViewModel> GetById(int id);
        Task<List<JournalViewModel>> GetAll();
        Task Create(JournalModel model);
        Task Update(int id, JournalModel model);
        Task Delete(int id);
    }
}

