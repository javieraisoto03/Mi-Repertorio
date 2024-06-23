const url = '/cancion';
const tbody = document.getElementById('cuerpo');
const cancion = document.getElementById('cancion');
const artista = document.getElementById('artista');
const tono = document.getElementById('tono');

let canciones = [];
window.onload = getData;

async function getData() {
  try {
    const response = await axios.get('/canciones');
    canciones = response.data;
    tbody.innerHTML = '';
    canciones.forEach((c, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${c.titulo}</td>
          <td>${c.artista}</td>
          <td>${c.tono}</td>
          <td>
            <button class="btn btn-warning" onclick="prepararCancion(${i}, '${c.id}')">Editar</button>
            <button class="btn btn-danger" onclick="eliminarCancion(${i}, '${c.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Error al obtener las canciones:', error);
  }
}

async function nuevaCancion() {
  const data = {
    titulo: cancion.value,
    artista: artista.value,
    tono: tono.value,
  };
  try {
    await axios.post(url, data);
    getData();
    cancion.value = '';
    artista.value = '';
    tono.value = '';
  } catch (error) {
    console.error('Error al agregar la canción:', error);
  }
}

async function eliminarCancion(i, id) {
  try {
    await axios.delete(url, { params: { id } });
    alert(`Canción ${canciones[i].titulo} eliminada`);
    getData();
  } catch (error) {
    console.error('Error al eliminar la canción:', error);
  }
}

function prepararCancion(i, id) {
  cancion.value = canciones[i].titulo;
  artista.value = canciones[i].artista;
  tono.value = canciones[i].tono;
  document.getElementById('editar').setAttribute('onclick', `editarCancion('${id}')`);
  document.getElementById('agregar').style.display = 'none';
  document.getElementById('editar').style.display = 'block';
}

async function editarCancion(id) {
  const data = {
    titulo: cancion.value,
    artista: artista.value,
    tono: tono.value,
  };
  try {
    await axios.put(`${url}/${id}`, data);
    getData();
    document.getElementById('agregar').style.display = 'block';
    document.getElementById('editar').style.display = 'none';
  } catch (error) {
    console.error('Error al editar la canción:', error);
  }
}

// Asignar funciones al ámbito global
window.nuevaCancion = nuevaCancion;
window.eliminarCancion = eliminarCancion;
window.prepararCancion = prepararCancion;
window.editarCancion = editarCancion;
