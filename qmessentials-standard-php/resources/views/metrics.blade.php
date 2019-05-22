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
                <td><a href="/metrics/{{$metric->metric_id}}/edit">{{$metric->metric_name}}</a></td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <div>
        <a href="/metrics/create">Add a Metric</a>
    </div>
@endsection