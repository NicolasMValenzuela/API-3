import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">

      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 pt-28">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Sobre Nosotros</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Somos una empresa líder en la venta de vehículos premium, comprometida con ofrecer 
            la mejor experiencia automotriz a nuestros clientes.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuestra Historia</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Fundada en 2010, nuestra empresa nació con la visión de revolucionar 
                la industria automotriz mediante la combinación de tecnología de vanguardia 
                y un servicio al cliente excepcional.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Durante más de una década, hemos construido relaciones sólidas con las 
                mejores marcas del mundo, permitiéndonos ofrecer una selección exclusiva 
                de vehículos que satisfacen las necesidades más exigentes.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Hoy somos reconocidos como uno de los concesionarios más confiables 
                del mercado, con miles de clientes satisfechos que respaldan nuestro 
                compromiso con la excelencia.
              </p>
            </div>
            <div className="bg-slate-900 h-80 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-3xl">NewCar</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Calidad</h3>
              <p className="text-gray-600">
                Nos comprometemos a ofrecer únicamente vehículos de la más alta calidad, 
                sometidos a rigurosos controles de inspección.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Servicio</h3>
              <p className="text-gray-600">
                Nuestro equipo de profesionales está dedicado a brindar un servicio 
                personalizado que supere las expectativas de cada cliente.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Innovación</h3>
              <p className="text-gray-600">
                Adoptamos las últimas tecnologías y tendencias del mercado para 
                ofrecer soluciones modernas y eficientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nuestro Equipo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Foto</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Juani</h3>
              <p className="text-blue-600 mb-2">Director General</p>
              <p className="text-gray-600 text-sm">
                Con más de 15 años de experiencia en la industria automotriz, 
                Juani lidera nuestro equipo con pasión y visión estratégica.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Foto</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Bautista </h3>
              <p className="text-blue-600 mb-2">Gerente de Ventas</p>
              <p className="text-gray-600 text-sm">
                Bautista es experto en identificar el vehículo perfecto para cada cliente, 
                con un enfoque personalizado y profesional.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Foto</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Francisco Reyna</h3>
              <p className="text-blue-600 mb-2">Especialista en Financiamiento</p>
              <p className="text-gray-600 text-sm">
                Francisco ayuda a nuestros clientes a encontrar las mejores opciones 
                de financiamiento para hacer realidad sus sueños automotrices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 rounded text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para encontrar tu próximo vehículo?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Explora nuestro catálogo y descubre la diferencia de trabajar con profesionales.
          </p>
          <div className="space-x-4">
            <Link
              to="/catalogo"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver Catálogo
            </Link>
            <Link
              to="/contacto"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contactarnos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;