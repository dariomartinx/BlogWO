using BlogApi.Data;
using BlogApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Registrar EF Core y la cadena de conexión
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2️⃣ Registrar servicios de la API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3️⃣ Registrar servicio Blog (inyección de dependencias)
builder.Services.AddScoped<IBlogService, BlogService>();

// 4️⃣ Habilitar CORS para permitir llamadas desde tu frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Dirección del frontend React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 5️⃣ Configurar middlewares
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 6️⃣ Activar CORS
app.UseCors("AllowReactApp");

// 7️⃣ HTTPS y autorización
app.UseHttpsRedirection();
app.UseAuthorization();

// 8️⃣ Mapear controladores
app.MapControllers();

// 9️⃣ Ejecutar la aplicación
app.Run();
