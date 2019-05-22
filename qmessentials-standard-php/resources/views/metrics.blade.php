@extends('layout')

@section('title','Metrics')

@section('content')
    <h2 class="subtitle">Metrics</h2>  
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
        @foreach($metrics as $metric) 
            <tr>
                <td>{{$metric->metric_name}}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <div>
        <a href="/metrics/create">Add a Metric</a>
    </div>
@endsection